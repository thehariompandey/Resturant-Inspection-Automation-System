const express = require('express');
const whatsappService = require('../services/whatsappService');
const Restaurant = require('../models/Restaurant');
const Section = require('../models/Section');
const Question = require('../models/Question');
const Response = require('../models/Response');
const auth = require('../middleware/auth');
const router = express.Router();

// Send inspection form
router.post('/send', auth, async (req, res) => {
  try {
    const { restaurantId, phoneNumbers } = req.body;

    // Get restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get sections
    const sections = await Section.find({ restaurant: restaurantId });
    if (sections.length === 0) {
      return res.status(400).json({ message: 'No sections found for this restaurant' });
    }

    // Get all questions
    const questions = await Question.find({ 
      restaurant: restaurantId 
    }).populate('section');
    
    if (questions.length === 0) {
      return res.status(400).json({ message: 'No questions found for this restaurant' });
    }

    // For prototype: Create a simple flow or send template
    let flowId = null;
    
    try {
      // Try to create WhatsApp Flow
      const flowName = `Inspection_${restaurant.name}_${Date.now()}`;
      const flowResponse = await whatsappService.createFlow({ name: flowName });
      flowId = flowResponse.id;

      // Generate and update flow JSON
      const flowJson = whatsappService.generateFlowJson(sections, questions);
      await whatsappService.updateFlowJson(flowId, flowJson);

      // Publish flow
      await whatsappService.publishFlow(flowId);
      
      console.log('Flow created successfully:', flowId);
    } catch (flowError) {
      console.error('Flow creation failed:', flowError.message);
      // Continue with template message as fallback
    }

    // Send messages to all phone numbers
    const results = [];
    for (const phoneNumber of phoneNumbers) {
      try {
        let result;
        if (flowId) {
          result = await whatsappService.sendFlowMessage(
            phoneNumber, 
            flowId, 
            restaurant, 
            sections
          );
        } else {
          // Fallback to simple message
          result = await whatsappService.sendTemplateMessage(
            phoneNumber,
            restaurant,
            sections.length
          );
        }
        
        results.push({
          phoneNumber,
          success: true,
          messageId: result.messages?.[0]?.id
        });
      } catch (sendError) {
        console.error(`Failed to send to ${phoneNumber}:`, sendError.message);
        results.push({
          phoneNumber,
          success: false,
          error: sendError.message
        });
      }
    }

    res.json({
      message: 'Inspection forms sent',
      flowId,
      results
    });

  } catch (error) {
    console.error('Send inspection error:', error);
    res.status(500).json({ 
      message: 'Error sending inspection forms',
      error: error.message 
    });
  }
});

// Webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook to receive responses
router.post('/webhook', async (req, res) => {
  try {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value) {
      return res.sendStatus(200);
    }

    // Handle flow response
    if (value.messages?.[0]?.type === 'interactive' && 
        value.messages?.[0]?.interactive?.type === 'nfm_reply') {
      
      const message = value.messages[0];
      const phoneNumber = message.from;
      const flowResponse = message.interactive.nfm_reply;
      const responseData = JSON.parse(flowResponse.response_json);
      
      // Extract section from flow token or payload
      const sectionId = flowResponse.body?.section || null;
      
      // Save response to database
      const response = new Response({
        restaurant: responseData.restaurant || null,
        section: sectionId,
        employeePhone: phoneNumber,
        employeeName: value.contacts?.[0]?.profile?.name || 'Unknown',
        answers: Object.entries(responseData).map(([key, value]) => ({
          questionText: key,
          answer: value
        })),
        flowId: flowResponse.name,
        submittedAt: new Date(message.timestamp * 1000)
      });

      await response.save();
      console.log('Response saved:', response._id);
    }

    // Handle regular text messages
    if (value.messages?.[0]?.type === 'text') {
      const message = value.messages[0];
      console.log('Text message received:', message.text.body);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(200); // Always return 200 to WhatsApp
  }
});

module.exports = router;
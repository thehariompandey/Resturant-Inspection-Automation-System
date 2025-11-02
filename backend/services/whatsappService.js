const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.token = process.env.WHATSAPP_API_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    this.baseURL = `https://graph.facebook.com/v18.0`;
  }

  // Create WhatsApp Flow
  async createFlow(flowData) {
    try {
      const url = `${this.baseURL}/${this.businessAccountId}/flows`;
      
      const response = await axios.post(url, {
        name: flowData.name,
        categories: ['SURVEY']
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating flow:', error.response?.data || error.message);
      throw error;
    }
  }

  // Update Flow JSON
  async updateFlowJson(flowId, flowJson) {
    try {
      const url = `${this.baseURL}/${flowId}/assets`;
      
      const response = await axios.post(url, {
        name: 'flow.json',
        asset_type: 'FLOW_JSON',
        flow_json: JSON.stringify(flowJson)
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating flow JSON:', error.response?.data || error.message);
      throw error;
    }
  }

  // Publish Flow
  async publishFlow(flowId) {
    try {
      const url = `${this.baseURL}/${flowId}/publish`;
      
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error publishing flow:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate Flow JSON structure
  generateFlowJson(sections, questions) {
    const screens = [];
    
    sections.forEach((section, sectionIndex) => {
      const sectionQuestions = questions.filter(q => 
        q.section._id.toString() === section._id.toString()
      );

      const screenData = {
        id: `section_${sectionIndex}`,
        title: section.name,
        data: {},
        layout: {
          type: 'SingleColumnLayout',
          children: []
        }
      };

      // Add questions to screen
      sectionQuestions.forEach((question, qIndex) => {
        const fieldId = `q_${sectionIndex}_${qIndex}`;
        
        let component;
        if (question.type === 'yes/no') {
          component = {
            type: 'RadioButtonsGroup',
            name: fieldId,
            label: question.text,
            'data-source': [
              { id: 'yes', title: 'Yes' },
              { id: 'no', title: 'No' }
            ],
            required: true
          };
        } else if (question.type === 'number') {
          component = {
            type: 'TextInput',
            name: fieldId,
            label: question.text,
            'input-type': 'number',
            required: true
          };
        } else {
          component = {
            type: 'TextInput',
            name: fieldId,
            label: question.text,
            required: true
          };
        }

        screenData.layout.children.push(component);
        screenData.data[fieldId] = {
          type: question.type === 'number' ? 'number' : 'string',
          __example__: question.type === 'yes/no' ? 'yes' : '0'
        };
      });

      // Add submit button
      screenData.layout.children.push({
        type: 'Footer',
        label: sectionIndex === sections.length - 1 ? 'Submit' : 'Next',
        'on-click-action': {
          name: 'complete',
          payload: {
            section: section._id.toString()
          }
        }
      });

      screens.push(screenData);
    });

    return {
      version: '3.0',
      screens: screens,
      data_api_version: '3.0'
    };
  }

  // Send WhatsApp message with flow
  async sendFlowMessage(phoneNumber, flowId, restaurant, sections) {
    try {
      const url = `${this.baseURL}/${this.phoneNumberId}/messages`;
      
      const message = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'interactive',
        interactive: {
          type: 'flow',
          header: {
            type: 'text',
            text: 'Restaurant Inspection'
          },
          body: {
            text: `Please complete the inspection for ${restaurant.name} - ${restaurant.location}`
          },
          footer: {
            text: 'Powered by Heyopey.ai'
          },
          action: {
            name: 'flow',
            parameters: {
              flow_message_version: '3',
              flow_token: `inspection_${Date.now()}`,
              flow_id: flowId,
              flow_cta: 'Start Inspection',
              flow_action: 'navigate',
              flow_action_payload: {
                screen: 'section_0'
              }
            }
          }
        }
      };

      const response = await axios.post(url, message, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error sending flow message:', error.response?.data || error.message);
      throw error;
    }
  }

  // Send simple template message (fallback)
  async sendTemplateMessage(phoneNumber, restaurant, sectionsCount) {
    try {
      const url = `${this.baseURL}/${this.phoneNumberId}/messages`;
      
      const message = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: `🏪 Restaurant Inspection\n\n` +
                `Restaurant: ${restaurant.name}\n` +
                `Location: ${restaurant.location}\n` +
                `Sections: ${sectionsCount}\n\n` +
                `Please complete your inspection and submit the form.`
        }
      };

      const response = await axios.post(url, message, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error sending template:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
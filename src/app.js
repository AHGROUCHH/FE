class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            questionInput: document.getElementById('question'), // Ajout de la référence au champ de question
            responseContainer: document.getElementById('response') // Ajout de la référence au conteneur de réponse
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton, questionInput } = this.args; // Ajout de questionInput
        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        questionInput.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    async onSendButton(chatbox) {
        const { questionInput, responseContainer } = this.args; // Ajout de responseContainer
        const question = questionInput.value.trim();
        if (question === "") {
            return;
        }

        this.messages.push({ name: "User", message: question });

        try {
            const response = await this.getChatbotResponse(question);
            this.messages.push({ name: "Bot", message: response });
            this.updateChatText(chatbox);
            questionInput.value = '';
        } catch (error) {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            questionInput.value = '';
        }
    }

    async getChatbotResponse(question) {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: question })
        });
        
        const data = await response.json();
        return data.response;
    }

    updateChatText(chatbox) {
        const { responseContainer } = this.args; // Utilisation de responseContainer
        let html = '';
        this.messages.slice().reverse().forEach(function (item) {
            html += `<div class="messages__item messages__item--${item.name.toLowerCase()}">${item.message}</div>`;
        });
        responseContainer.innerHTML = html; // Utilisation de responseContainer pour mettre à jour le HTML
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatbox = new Chatbox();
    chatbox.display();
});

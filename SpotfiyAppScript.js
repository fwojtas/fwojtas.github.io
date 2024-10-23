new Vue({
    el: '#app',
    data: {
        token: 'BQCg-0xfZjWv4FBfTGS48RHJPHkY3vEbqQpV3FGCBA7s8FV1tnE8J8wx4igb0C4K9SiSe0-aGwX1TjtD8NGzHaapno_ABUWM1ekxgxa2ujnkaubArd-0x85ZRVUDrNOURnviIlO8vBHqJIuBl8-i3_QFQU0rM3ifnz1ngjjX79RBTks17kReiFzzQrD4Wnj71aa63ggpthu-Rhst7v9XKpT33dLHWAj_2lFmU0BMxQzO_-efIIG0NkL10J9w-lcXXCkCMk3yoVltvso', // Spotify token
        openaiToken: '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', // Directly assign your OpenAI API key here
        tracks: [],
        chatResponse: '',
    },
    computed: {
        formattedTracks() {
            return this.tracks
                .map(track => `${track.name} by ${track.artists}`)
                .join(', ');
        }
    },
    methods: {
        async fetchTopTracks() {
            const endpoint = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=15&offset=15';
            try {
                const response = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                this.tracks = data.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists.map(artist => artist.name).join(', ')
                }));
            } catch (error) {
                console.error('Error fetching top tracks:', error);
            }
        },
        async sendChatGPTMessage() {
            const messageContent = `
        Please roast me in a paragraph given these songs I listen to a lot recently: 
        ${this.formattedTracks}.`;

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.openaiToken}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4',
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: messageContent }
                        ],
                        max_tokens: 100,
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Read the full error response
                    throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
                }

                const data = await response.json();
                this.chatResponse = data.choices[0]?.message?.content || 'No response content';
            } catch (error) {
                console.error('Error sending message to ChatGPT:', error);
                this.chatResponse = 'Error occurred while fetching response.';
            }
        }



    }
});

new Vue({
    el: '#app',
    data: {
        homeContent: '',
        aboutContent: '',
        projectsContent: '',
        contactContent: ''
    },
    created() {
        this.loadContent();
    },
    methods: {
        async loadContent() {
            try {
                const [homeResponse, aboutResponse, projectsResponse, contactResponse] = await Promise.all([
                    fetch('home.txt').then(response => response.text()),
                    fetch('about.txt').then(response => response.text()),
                    fetch('projects.txt').then(response => response.text()),
                    fetch('contact.txt').then(response => response.text())
                ]);

                this.homeContent = this.formatText(homeResponse);
                this.aboutContent = this.formatText(aboutResponse);
                this.projectsContent = this.formatText(projectsResponse);
                this.contactContent = this.formatText(contactResponse);
            } catch (error) {
                console.error('Error loading content:', error);
            }
        },
        formatText(text) {
            return text.replace(/\n/g, '<br>');
        }
    }
});

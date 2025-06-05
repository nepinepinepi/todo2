import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';

const App = {
  data: () => ({ todos: [], title: '' }),
  async mounted() {
    const res = await fetch('/todos');
    this.todos = await res.json();
  },
  methods: {
    async addTodo() {
      await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Date.now().toString(), title: this.title })
      });
      this.title = '';
      const res = await fetch('/todos');
      this.todos = await res.json();
    }
  },
  template: `<v-app>
    <v-main>
      <v-container>
        <v-text-field v-model="title" label="New Todo"></v-text-field>
        <v-btn @click="addTodo">Add</v-btn>
        <v-list>
          <v-list-item v-for="t in todos" :key="t.id">{{ t.title }}</v-list-item>
        </v-list>
      </v-container>
    </v-main>
  </v-app>`
};

createApp(App).use(createVuetify()).mount('#app');

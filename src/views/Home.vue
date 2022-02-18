<template>
  <DefaultLayout>
    <section
      class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800"
    >
      <h2
        class="text-lg font-semibold text-gray-700 capitalize dark:text-white"
      >
        Search Bar
      </h2>

      <h3 v-if="this.badword" class="text-red-500">
        Some profane langue is in the query
      </h3>

      <h3 v-if="this.sugesstion.length !== 0" class="text-green-500">
        <p v-for="i in this.sugesstion" :key="i.reason">{{ i.reason }}</p>
      </h3>

      <Form @submit="handleLogin" :validation-schema="schema">
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
          <div>
            <label class="text-gray-700 dark:text-gray-200" for="query"
              >Query</label
            >
            <Field
              name="query"
              type="text"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
            <ErrorMessage name="query" class="text-red-500" />
          </div>
          <div></div>
          <div>
            <label class="text-gray-700 dark:text-gray-200" for="score"
              >Search BY</label
            >
            <Field
              name="score"
              as="select"
              :v-slot="{ score }"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            >
              <option value="tf-idf">basic search</option>
              <option value="bm25">advance search</option>
            </Field>
            <ErrorMessage name="score" class="text-red-500" />
          </div>
        </div>
        <div class="flex justify-center mt-6">
          <button
            class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
          >
            search
          </button>
        </div>
      </Form>
    </section>
  </DefaultLayout>

  <DefaultLayout>
    <table
      v-if="this.output.length === 10"
      class="min-w-full divide-y divide-gray-200"
    >
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Rank
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Song
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Artist
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="i in this.output" :key="i.rank" >
          <td class="px-6 py-4 whitespace-nowrap">{{ i.rank }}</td>
          <td>{{ i.song }}</td>
          <td>{{ i.artist }}</td>
        </tr>
      </tbody>
    </table>

    <table
      v-else-if="this.output.length !== 10"
      class="min-w-full divide-y divide-gray-200"
    >
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Result
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="i in this.output" :key="i">
          <td class="px-6 py-4 whitespace-wrap">{{ i }}</td>
        </tr>
      </tbody>
    </table>
    
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import search from "@/service/search.js";
import * as yup from "yup";
export default {
  name: "Login",
  inject: ["GlobalState"],
  components: {
    DefaultLayout,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      query: yup.string().required("Query is required!"),
      score: yup.string().required("Please Select you score"),
    });
    return {
      schema,
      ranking: "",
      result: "",
      output: [],
      badword: false,
      sugesstion: [],
    };
  },
  methods: {
    checkBadWord(word) {
      var Filter = require("bad-words");
      let filter = new Filter();
      this.badword = filter.isProfane(word);
    },
    querysugesstion(sentence) {
      this.sugesstion = [];
      var writeGood = require('write-good');
      this.sugesstion = writeGood(sentence);
      console.log(this.sugesstion);
    },
    handleLogin(user) {
      this.output = [];
      this.result = "";
      this.ranking = user;
      this.checkBadWord(user.query);
      this.querysugesstion(user.query);
      search.searchSong(this.ranking).then((res) => {
        this.result = res.data;
        if (this.result.length === 10) {
          for (let i = 0; i < this.result.length; i++) {
            this.output.push(JSON.parse(this.result[i]));
          }
        } else {
          for (let i = 0; i < this.result.length; i++) {
            if (this.result[i].length > 100) {
              this.output.push(JSON.parse(this.result[i]));
            } else {
              this.output.push(this.result[i]);
            }
          }
        }
      });
    },
  },
};
</script>

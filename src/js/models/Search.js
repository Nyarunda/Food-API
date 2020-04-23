import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getSearchResult() {
        try {
            // const key = '4b02089cc1764be9bd0e09056c41672b';
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`); // Automatically returns json and better error handling
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (e) {
            console.log(e.response)
        }
    }

}
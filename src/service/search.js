import apiClient from "./axiosClient";
export default {
  searchSong(data) {
    return apiClient.post("/search-song", {
      query: data.query,
      score: data.score,
    });
  },
};

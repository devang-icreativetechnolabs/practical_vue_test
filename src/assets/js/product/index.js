import TableView from "@/components/product/TableView.vue";
export default {
  name: "Home",
  components: {
    TableView: TableView,
  },
  data() {
    return {
      url: "https://fakestoreapi.com/products",
      productList: [],
      categories: [],
    };
  },
  methods: {
    async getCategories() {
      if (localStorage.getItem("categories")) {
        return JSON.parse(localStorage.getItem("categories"));
      } else {
        const res = await fetch(`${this.url}/categories`);
        const data = await res.json();
        localStorage.setItem("categories", JSON.stringify(data));
        return data;
      }
    },
    async getProducts() {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      const reversData = data.reverse();
      localStorage.setItem("products", JSON.stringify(reversData));
      return reversData;
    },
  },
  async mounted() {
    if (
      localStorage.getItem("products") &&
      JSON.parse(localStorage.getItem("products")).length > 0
    ) {
      this.productList = JSON.parse(localStorage.getItem("products"));
    } else {
      this.productList = await this.getProducts();
    }
    this.categories = await this.getCategories();
  },
};

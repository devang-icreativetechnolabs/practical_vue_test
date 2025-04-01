export default {
    name: "ConfirmModal",
    props: ["id", "show", "confirmMessage"],
    emits: ["cancel", "confirm"],
    methods: {
      cancel() {
        this.$emit("cancel");
      },
      confirm() {
        this.$emit("confirm", this.id);
      },
    },
  };
<template>
  <div
    class="modal"
    tabindex="-1"
    :class="{ 'show d-block': show }"
    :style="{ display: show ? 'block' : 'none' }"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-center">
          <h5 class="modal-title d-flex justify-content-center text-center">
            Are you sure ?
          </h5>
        </div>
        <div class="modal-body text-center">
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button type="button" class="btn btn-secondary" @click="cancel">
            No
          </button>
          <button type="button" class="btn btn-primary" @click="confirm">
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>
<script>
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
</script>

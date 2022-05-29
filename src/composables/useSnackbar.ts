import { reactive, toRefs } from 'vue';

const data = reactive({
  visible: false,
  message: '',
});

function useSnackbar() {
  function show(message: string) {
    data.message = message;
    data.visible = true;

    setTimeout(() => {
      data.visible = false;
    }, 2000);
  }

  return {
    ...toRefs(data),
    show,
  };
}

export { useSnackbar };

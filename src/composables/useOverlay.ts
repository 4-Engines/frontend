import { reactive, toRefs } from 'vue';

const data = reactive({
  visible: false,
  message: '',
});

function useOverlay() {
  function show(message: string) {
    data.message = message;
    data.visible = true;
  }

  function hide() {
    data.visible = false;
  }

  return {
    ...toRefs(data),
    show,
    hide,
  };
}

export { useOverlay };

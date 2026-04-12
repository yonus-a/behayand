import loadingDirective from "~/directives/loading";
import imagePicker from "~/directives/imagePicker";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("loading", loadingDirective);
  nuxtApp.vueApp.directive("image-picker", imagePicker);
});
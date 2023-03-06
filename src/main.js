import { createApp } from "vue";
import App from "./App.vue";
import ButtonCustom from "@/components/Button/ButtonCustom.vue";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";

const app = createApp(App);

app.config.errorHandler = (err, req, res) => {};
app.component("ButtonCustom", ButtonCustom);
app.mount("#app");

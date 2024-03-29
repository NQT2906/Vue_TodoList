import ButtonCustom from "@/components/Button/ButtonCustom.vue";
import { createApp } from "vue";
import App from "./App.vue";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";

const app = createApp(App);

// app.use(VueAxios, axios);

app.config.errorHandler = (err, req, res) => {};
app.component("ButtonCustom", ButtonCustom);
app.mount("#app");

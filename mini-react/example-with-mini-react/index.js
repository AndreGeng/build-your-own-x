import MiniReactDOM from "../src/mini-react-dom";
import "./index.pcss"

MiniReactDOM.render({
  type: "section",
  props: {
    children: [{
      type: "h1",
      props: {
        children: "TODOS"
      },
    }, {
      type: "ul",
      props: {
        children: [{
          type: "li",
          props: {
            className: "item item--done",
            children: [{
              type: "input",
              props: {
                id: "1",
                type: "checkbox",
                checked: true,
              }
            }, {
              type: "label",
              props: {
                for: "1",
                children: "起床",
              }
            }]
          }
        }, {
          type: "li",
          props: {
            className: "item",
            children: [{
              type: "input",
              props: {
                id: "2",
                type: "checkbox",
                checked: false,
              }
            }, {
              type: "label",
              props: {
                for: "2",
                children: "洗漱",
              }
            }]
          }
        }, {
          type: "li",
          props: {
            className: "item",
            children: [{
              type: "input",
              props: {
                id: "3",
                type: "checkbox",
                checked: false,
              }
            }, {
              type: "label",
              props: {
                for: "3",
                children: "打酱油",
              }
            }]
          }
        }]
      }
    }]
  },
}, document.getElementById("root"));

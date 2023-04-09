window.addEventListener('load', main, true)

const checkClassIntervalMilliSecond = 1000;
var appliedNode = [];

function main() {
  doFunctionWhenClassCreated('notion-discussion-input', changeKeyBind)
  doFunctionWhenClassCreated('notion-discussion-input-edit-existing-comment', changeKeyBind)
}

// notionは動的にDOMが作成されるため、クラスを見つけたら処理を開始する。
function doFunctionWhenClassCreated(className, f) {
  setInterval(jsLoaded, checkClassIntervalMilliSecond);
  function jsLoaded() {
    var elems = document.getElementsByClassName(className);
    if (elems.length > 0) {
      f(className);
    }
  }
}

const pressEnter = new KeyboardEvent("keydown", {
  key: "Enter",
  code: "Enter",
  keyCode: 13,
  bubbles: true,
});

const pressShiftEnter = new KeyboardEvent("keydown", {
  key: "Enter",
  code: "Enter",
  keyCode: 13,
  shiftKey: true,
  bubbles: true,
});

function changeKeyBind(className) {
  var elems = document.getElementsByClassName(className);
  for (const elem of elems) {
    if (appliedNode.includes(elem)) {
      console.debug("find elem");
      continue;
    }
    console.debug("new elem");
    appliedNode.push(elem);

    const useCapture = true;
    elem.addEventListener('keydown', (event) => {
      console.debug(event);

      // スクリプトから送信されたキーは素通しする。
      if (!event.isTrusted) {
        return;
      }

      // Shift+Enter / Cmd+Enter to Enter
      const pressedCmdEnter = event.metaKey && event.key === 'Enter';
      const pressedShiftEnter = event.shiftKey && event.key === 'Enter';
      if (pressedCmdEnter || pressedShiftEnter) {
        event.stopPropagation();
        elem.dispatchEvent(pressEnter);
        return;
      }

      // Enter to Shift+Enter
      const pressedEnter = event.altKey === false && event.ctrlKey === false && event.key === 'Enter';
      if (pressedEnter) {
        event.stopPropagation();
        elem.dispatchEvent(pressShiftEnter);
        return;
      }
    }, useCapture);
  }
}

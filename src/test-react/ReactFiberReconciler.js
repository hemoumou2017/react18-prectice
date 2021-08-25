import { Placement } from "./const";
// 原生标签
function updateHostComponent(workInProgress) {
  // 修身
  // 构建真实dom节点
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }
  // 齐家
  // 协调子节点
  reconcileChildren(workInProgress, workInProgress.props.children);
  console.log("workInProgress", workInProgress); //sy-log
}
// 文本
function updateTextCompoent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = document.createTextNode(workInProgress.props);
  }
}
// 当前正在工作的fiber
let currentlyRenderingFiber = null;
// 当前正在工作的hook
let workInProgressHook = null;
// 1-》2-》3
function updateFunctionComponent(workInProgress) {
  // 当前正在工作的fiber以及hook的初始化
  currentlyRenderingFiber = workInProgress;
  currentlyRenderingFiber.memoizedState = null;
  workInProgressHook = null;

  const { type, props } = workInProgress;
  const children = type(props);
  reconcileChildren(workInProgress, children);
}

function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  const instance = new type(props);
  const children = instance.render();
  reconcileChildren(workInProgress, children);
}

function updateFragmentComponent(workInProgress) {
  reconcileChildren(workInProgress, workInProgress.props.children);
}

function reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  let newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = workInProgress.alternate && workInProgress.alternate.child;

  let shouldTrackSideEffects = oldFiber !== null;

  // 记录上一个插入位置
  let lastPlacedIndex = 0;
  let newIdx = 0;

  if (!oldFiber) {
    for (; newIdx < newChildren.length; newIdx++) {
      let child = newChildren[newIdx];
      // 插入
      let newFiber = {
        key: child.key,
        type: child.type, // 类型
        props: { ...child.props }, // 属性
        stateNode: null, //如果是原生标签，代表dom节点，如果是类组件就代表实例
        child: null, // 第一个子节点 fiber
        sibling: null, // 下一个兄弟节点  fiber
        return: workInProgress, // 父节点
        alternate: null,
        flags: Placement,
      };

      if (isStringOrNumber(child)) {
        newFiber.props = child;
      }

      lastPlacedIndex = placeChild(
        shouldTrackSideEffects,
        newFiber,
        lastPlacedIndex,
        newIdx
      );

      if (previousNewFiber === null) {
        // 第一个子fiber
        workInProgress.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
  }
}
function isStringOrNumber(sth) {
  return typeof sth === "string" || typeof sth === "number";
}
function isArray(sth) {
  return Array.isArray(sth);
}
function isfn(sth) {
  return typeof sth === "function";
}
// 根据vnode，生成node
function createNode(workInProgress) {
  let node = document.createElement(workInProgress.type);
  updateNode(node, {}, workInProgress.props);
  return node;
}
// 更新原生标签的属性，如className、href、id、（style、事件）等
function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isStringOrNumber(prevVal[k])) {
          node.textContent = "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        if (!(k in nextVal)) {
          node[k] = "";
        }
      }
    });

  Object.keys(nextVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isStringOrNumber(nextVal[k])) {
          node.textContent = nextVal[k] + "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

function placeChild(shouldTrackSideEffects, newFiber, lastPlacedIndex, newIdx) {
  newFiber.index = newIdx;
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex;
  }

  const current = newFiber.alternate;
  if (current !== null) {
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // 移动位置
      newFiber.flags = Placement;
      return lastPlacedIndex;
    } else {
      // 不移动
      return oldIndex;
    }
  } else {
    // 插入新增的节点
    newFiber.flags = Placement;
    return lastPlacedIndex;
  }
}
export {
  updateHostComponent,
  isStringOrNumber,
  isArray,
  isfn,
  updateFunctionComponent,
  updateClassComponent,
  updateTextCompoent,
  updateFragmentComponent,
};

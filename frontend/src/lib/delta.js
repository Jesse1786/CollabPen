export function createDelta(text, fromA, toA, fromB, toB) {
  if (fromA < toA && fromB < toB) {
    return {
      replace: { from: fromA, to: toA, text: text.slice(fromA, toA) },
    };
  } else if (fromA < toA) {
    return { delete: { from: fromA, to: toA } };
  } else if (fromB < toB) {
    return {
      insert: { from: fromB, text: text.slice(fromB, toB) },
    };
  } else {
    return null;
  }
}

export function resolveDelta(text, delta) {
  if (delta.replace) {
    const { from, to, text: oldText } = delta.replace;
    return text.slice(0, from) + oldText + text.slice(to);
  }

  if (delta.delete) {
    const { from, to } = delta.delete;
    console.log(text.slice(0, from) + text.slice(to));
    return text.slice(0, from) + text.slice(to);
  }

  if (delta.insert) {
    const { from, text: newText } = delta.insert;
    return text.slice(0, from) + newText + text.slice(from);
  }
}

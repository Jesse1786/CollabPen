export function createSingleDelta(text, fromA, toA, fromB, toB) {
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

export function createDelta(text, ranges) {
  return ranges.map(({ fromA, toA, fromB, toB }) =>
    createSingleDelta(text, fromA, toA, fromB, toB)
  );
}

export function resolveDelta(text, delta) {
  let newText = text;

  delta.forEach((singleDelta) => {
    if (singleDelta.replace) {
      const { from, to, text: t } = singleDelta.replace;
      newText = newText.slice(0, from) + t + newText.slice(to);
    } else if (singleDelta.delete) {
      const { from, to } = singleDelta.delete;
      console.log(text.slice(0, from) + text.slice(to));
      newText = newText.slice(0, from) + newText.slice(to);
    } else if (singleDelta.insert) {
      const { from, text: t } = singleDelta.insert;
      newText = newText.slice(0, from) + t + newText.slice(from);
    }
  });

  return newText;
}

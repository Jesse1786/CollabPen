export function createSingleDelta(text, fromA, toA, fromB, toB) {
  if (fromA < toA && fromB < toB) {
    return {
      replace: { from: fromA, to: toA, text: text.slice(fromB, toB) },
    };
  } else if (fromA < toA) {
    return { delete: { from: fromA, to: toA } };
  } else if (fromB < toB) {
    return {
      insert: { from: fromA, text: text.slice(fromB, toB) },
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
  let offset = 0;

  delta.forEach((singleDelta) => {
    if (singleDelta.replace) {
      const { from, to, text: t } = singleDelta.replace;
      newText =
        newText.slice(0, from + offset) + t + newText.slice(to + offset);
      offset += t.length - (to - from);
    } else if (singleDelta.delete) {
      const { from, to } = singleDelta.delete;
      newText = newText.slice(0, from + offset) + newText.slice(to + offset);
      offset -= to - from;
    } else if (singleDelta.insert) {
      const { from, text: t } = singleDelta.insert;
      newText =
        newText.slice(0, from + offset) + t + newText.slice(from + offset);
      offset += t.length;
    }
  });

  return newText;
}

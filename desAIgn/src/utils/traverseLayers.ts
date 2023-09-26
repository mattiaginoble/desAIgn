export const hasChildren = (node: unknown): node is ChildrenMixin =>
  !!(node && (node as any).children);

export async function traverseLayers(
  layer: SceneNode,
  cb: (layer: SceneNode, parent: BaseNode | null) => void,
  parent: BaseNode | null = null
) {
  if (layer) {
    await cb(layer, parent);
  }
  if (hasChildren(layer)) {
    for (const child of layer.children) {
      await traverseLayers(child, cb, layer);
    }
  }
}

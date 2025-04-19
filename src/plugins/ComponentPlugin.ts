// src/plugins/ComponentPlugin.ts
import type { PropertyField } from "../config/componentProperties";
import type { DroppedItem } from "../types";

/**
 * This interface describes the structure for each component plugin.
 */
export interface ComponentPlugin {
  /** Unique key for this component type (e.g. "button", "card") */
  type: string;
  /** A human-readable name */
  name: string;
  /** Property definitions used by the Property Panel */
  properties: PropertyField[];
  /**
   * The React component used to render the element on the canvas.
   * Use React.PropsWithChildren so that children are accepted.
   */
  Render: React.ComponentType<React.PropsWithChildren<{ item: DroppedItem }>>;
  /**
   * A function that generates the JSX/code string for this element.
   * @param item - the dropped item data
   * @param childrenMarkup - markup string for any nested children (if applicable)
   */
  generateMarkup: (item: DroppedItem, childrenMarkup?: string) => string;
}

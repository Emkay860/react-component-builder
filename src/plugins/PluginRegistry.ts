// src/plugins/PluginRegistry.ts
import type { ComponentPlugin } from "./ComponentPlugin";

class PluginRegistry {
  private plugins: Record<string, ComponentPlugin> = {};

  /** Register a plugin using its type as the key. */
  register(plugin: ComponentPlugin) {
    this.plugins[plugin.type] = plugin;
  }

  /** Look up a plugin by its type key. */
  getPlugin(type: string): ComponentPlugin | undefined {
    return this.plugins[type];
  }

  /** Get a list of all registered plugins. */
  getAllPlugins(): ComponentPlugin[] {
    return Object.values(this.plugins);
  }
}

// Export a singleton instance
export const pluginRegistry = new PluginRegistry();

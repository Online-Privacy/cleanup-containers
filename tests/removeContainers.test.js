import { describe, it, expect, vi } from 'vitest';
import { WebExtensionsApiFake } from 'webextensions-api-fake';
import { removeContainers } from '../removeContainers';

describe('removeContainers', () => {
  it('removes only matching and inactive containers by default', async () => {
    const browser = new WebExtensionsApiFake();

    // Add fake containers
    browser.contextualIdentities.query.mockResolvedValue([
      { name: 'tmp1', cookieStoreId: 'store-1' },
      { name: 'tmp2', cookieStoreId: 'store-2' },
      { name: 'keep', cookieStoreId: 'store-3' }
    ]);

    // Simulate tabs using only store-2 (active)
    browser.tabs.query.mockResolvedValue([
      { cookieStoreId: 'store-2' }
    ]);

    // Spy on remove
    const removeSpy = vi.fn();
    browser.contextualIdentities.remove = removeSpy;

    const removed = await removeContainers({
      patternInput: '^tmp',
      includeActive: false,
      browser
    });

    expect(removed).toEqual(['tmp1']); // tmp2 is skipped (active)
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith('store-1');
  });

  it('removes matching containers even if active when checkbox is true', async () => {
    const browser = new WebExtensionsApiFake();

    browser.contextualIdentities.query.mockResolvedValue([
      { name: 'tmp1', cookieStoreId: 'store-1' },
      { name: 'tmp2', cookieStoreId: 'store-2' }
    ]);

    browser.tabs.query.mockResolvedValue([
      { cookieStoreId: 'store-1' },
      { cookieStoreId: 'store-2' }
    ]);

    const removeSpy = vi.fn();
    browser.contextualIdentities.remove = removeSpy;

    const removed = await removeContainers({
      patternInput: '^tmp',
      includeActive: true,
      browser
    });

    expect(removed).toEqual(['tmp1', 'tmp2']);
    expect(removeSpy).toHaveBeenCalledTimes(2);
  });

  it('throws on invalid regex input', async () => {
    const browser = new WebExtensionsApiFake();

    await expect(() =>
      removeContainers({
        patternInput: '[unclosed',
        includeActive: true,
        browser
      })
    ).rejects.toThrow(/Invalid regex/);
  });
});

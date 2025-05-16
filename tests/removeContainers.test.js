const sinon = require('sinon');
const sinonChrome = require('sinon-chrome');
const { removeContainers } = require('../src/removeContainers');

describe('removeContainers', () => {
  beforeEach(() => {
    sinonChrome.reset();
    global.browser = sinonChrome;

    // Manually mock contextualIdentities namespace with stub methods
    browser.contextualIdentities = {
      query: sinon.stub().resolves([]),
      remove: sinon.stub().resolves(),
    };

    // Stub tabs.query method
    browser.tabs.query = sinon.stub().resolves([]);
  });

  afterEach(() => {
    sinonChrome.reset();
  });

  it('removes only matching and inactive containers by default', async () => {
    browser.contextualIdentities.query.resolves([
      { name: 'tmp1', cookieStoreId: 'firefox-container-1' },
      { name: 'tmp2', cookieStoreId: 'firefox-container-2' },
      { name: 'keep', cookieStoreId: 'firefox-container-3' },
    ]);
    browser.tabs.query.resolves([
      { cookieStoreId: 'firefox-container-2' } // active tab in tmp2
    ]);
    browser.contextualIdentities.remove.resolves();

    const removed = await removeContainers({
      patternInput: '^tmp',
      includeActive: false,
      browser,
    });

    expect(removed).toEqual(['tmp1']);
    sinon.assert.calledOnce(browser.contextualIdentities.remove);
    sinon.assert.calledWith(browser.contextualIdentities.remove, 'firefox-container-1');
  });

  it('removes matching containers including active when includeActive is true', async () => {
    browser.contextualIdentities.query.resolves([
      { name: 'tmp1', cookieStoreId: 'firefox-container-1' },
      { name: 'tmp2', cookieStoreId: 'firefox-container-2' },
      { name: 'keep', cookieStoreId: 'firefox-container-3' },
    ]);
    browser.tabs.query.resolves([
      { cookieStoreId: 'firefox-container-2' } // active tab in tmp2
    ]);
    browser.contextualIdentities.remove.resolves();

    const removed = await removeContainers({
      patternInput: '^tmp',
      includeActive: true,
      browser,
    });

    expect(removed).toEqual(['tmp1', 'tmp2']);
    sinon.assert.calledTwice(browser.contextualIdentities.remove);
    sinon.assert.calledWith(browser.contextualIdentities.remove, 'firefox-container-1');
    sinon.assert.calledWith(browser.contextualIdentities.remove, 'firefox-container-2');
  });

  it('throws on invalid regex pattern', async () => {
    await expect(removeContainers({
      patternInput: '[invalid',
      includeActive: false,
      browser,
    })).rejects.toThrow('Invalid regex: Invalid regular expression: /[invalid/: Unterminated character class');
  });

  it('does not remove any containers if none match', async () => {
    browser.contextualIdentities.query.resolves([
      { name: 'work', cookieStoreId: 'store-1' },
      { name: 'play', cookieStoreId: 'store-2' },
    ]);
    browser.tabs.query.resolves([]);

    const removed = await removeContainers({
      patternInput: '^tmp',
      includeActive: false,
      browser,
    });

    expect(removed).toEqual([]);
    sinon.assert.notCalled(browser.contextualIdentities.remove);
  });
});

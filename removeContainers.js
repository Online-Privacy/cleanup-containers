export async function removeContainers({ patternInput, includeActive, browser }) {
    let regex;
    try {
      regex = new RegExp(patternInput);
    } catch (err) {
      throw new Error("Invalid regex: " + err.message);
    }
  
    const identities = await browser.contextualIdentities.query({});
    const tabs = await browser.tabs.query({});
    
    const activeStoreIds = new Set(tabs.map(tab => tab.cookieStoreId));
  
    console.debug(`Found a total of ${identities.length} containers overall`)

    let removed = [];
  
    for (const identity of identities) {
      const isMatch = regex.test(identity.name);
      const isActive = activeStoreIds.has(identity.cookieStoreId);
  
      if (isMatch && (includeActive || !isActive)) {
        console.info(`Removing container ${identity.name}:`);
        await browser.contextualIdentities.remove(identity.cookieStoreId);
        removed.push(identity.name);
      }
    }
  
    return removed;
  }
  
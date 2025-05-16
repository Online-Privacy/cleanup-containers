document.getElementById("removeBtn").addEventListener("click", async () => {
  const pattern = document.getElementById("pattern").value.trim();
  const includeActive = document.getElementById("includeActive").checked;
  const status = document.getElementById("status");

  if (!pattern) {
    status.textContent = "Please enter a pattern.";
    return;
  }

  let regex;
  try {
    regex = new RegExp(pattern);
  } catch (err) {
    status.textContent = "Invalid regex: " + err.message;
    return;
  }

  const identities = await browser.contextualIdentities.query({});
  const tabs = await browser.tabs.query({}); // Get all open tabs

  // Create a Set of all container IDs that have open tabs
  const activeContainerIds = new Set(
    tabs.map(tab => tab.cookieStoreId).filter(Boolean)
  );

  console.log(`Found ${identities.length} containers`)

  let removed = 0;

  for (const identity of identities) {
    const isMatching = regex.test(identity.name);
    const isActive = activeContainerIds.has(identity.cookieStoreId);

    if (isMatching && (includeActive || !isActive)) {
      try {
        console.info(`Removing container ${identity.name}:`);
        await browser.contextualIdentities.remove(identity.cookieStoreId);
        removed++;
      } catch (err) {
        console.error(`Failed to remove container ${identity.name}:`, err);
      }
    }
  }

  status.textContent = `Removed ${removed} container(s) starting with "${pattern}".`;
});

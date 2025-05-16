const { removeContainers } = require('../src/removeContainers');

document.getElementById("removeBtn").addEventListener("click", async () => {
  const patternInput = document.getElementById("pattern").value.trim();
  const includeActive = document.getElementById("includeActive").checked;
  const status = document.getElementById("status");

  if (!patternInput) {
    status.textContent = "Please enter a regex pattern.";
    return;
  }

  status.textContent = "Removing containers…";

  try {
    const removed = await removeContainers({
      patternInput,
      includeActive,
      browser // pass the real browser API object
    });

    status.textContent = `Removed ${removed.length} container(s) matching "${patternInput}".`;
  } catch (error) {
    status.textContent = error.message;
  }
});

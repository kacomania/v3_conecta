const uri = "ws://127.0.0.1:58016/Q0GfS-HazC0=/ws";

const ws = new WebSocket(uri);

ws.onopen = () => {
  ws.send(JSON.stringify({ jsonrpc: "2.0", id: "1", method: "getVM" }));
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  
  if (response.id === "1") {
    const mainIsolate = response.result.isolates.find(i => i.name.includes("main"));
    if (mainIsolate) {
      console.log("Found main isolate:", mainIsolate.id);
      ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: "2",
        method: "reloadSources",
        params: { isolateId: mainIsolate.id }
      }));
    } else {
      console.error("Main isolate not found");
      process.exit(1);
    }
  } else if (response.id === "2") {
    if (response.error) {
      console.error("Hot reload error:", response.error);
    } else {
      console.log("Hot reload successful:", response.result.type);
    }
    process.exit(0);
  }
};

ws.onerror = (e) => {
  console.error("WebSocket error:", e.message);
  process.exit(1);
};

// client/src/components/PlayerCounter.tsx
import React, { useEffect, useState } from "react";
import { socketService } from "../services/socketService";

const PlayerCounter: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    function handlePlayerCount(count: number) {
      console.log("📡 Received playerCount:", count);
      setPlayerCount(count);
    }

    // Wait until socket is connected before listening
    if (socketService.isConnected()) {
      socketService.on("playerCount", handlePlayerCount);
    } else {
      // If not connected yet, connect first then listen once connected
      socketService.connect();
      socketService.on("connect", () => {
        console.log("🔗 Listening for playerCount after connect");
        socketService.on("playerCount", handlePlayerCount);
      });
    }

    return () => {
      socketService.off("playerCount", handlePlayerCount);
    };
  }, []);

  return (
    <div style={{ margin: "10px", fontSize: "20px" }}>
      🟢 {playerCount} {playerCount === 1 ? "Player" : "Players"} Online
    </div>
  );
};

export default PlayerCounter;

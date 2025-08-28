
import React from "react";
import { GameBoard } from "@/components/gameboard/GameBoard";

const FunBoardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-50 flex items-center justify-center">
      <GameBoard />
    </div>
  );
};

export default FunBoardPage;

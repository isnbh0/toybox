import React, { useState, useEffect } from 'react';

export default function ClickerApp() {
  const [score, setScore] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);

  // 자동 클릭 기능
  useEffect(() => {
    if (autoClickers > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + autoClickers);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClickers]);

  const handleClick = () => {
    setScore(prev => prev + clickPower);
  };

  const buyClickUpgrade = () => {
    const cost = clickPower * 10;
    if (score >= cost) {
      setScore(prev => prev - cost);
      setClickPower(prev => prev + 1);
    }
  };

  const buyAutoClicker = () => {
    const cost = (autoClickers + 1) * 50;
    if (score >= cost) {
      setScore(prev => prev - cost);
      setAutoClickers(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setClickPower(1);
    setAutoClickers(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 클리커 게임</h1>
          <p className="text-white/80">클릭해서 점수를 올려보세요!</p>
        </div>

        {/* 점수 표시 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {score.toLocaleString()}
          </div>
          <div className="text-white/80 text-sm">점수</div>
        </div>

        {/* 메인 클릭 버튼 */}
        <div className="text-center mb-8">
          <button
            onClick={handleClick}
            className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl transform transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center text-6xl"
          >
            🔥
          </button>
          <div className="text-white/80 text-sm mt-2">
            클릭당 +{clickPower}점
          </div>
        </div>

        {/* 업그레이드 섹션 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🛒 업그레이드</h2>
          
          {/* 클릭 파워 업그레이드 */}
          <div className="mb-4">
            <button
              onClick={buyClickUpgrade}
              disabled={score < clickPower * 10}
              className={`w-full p-3 rounded-lg font-semibold transition-all ${
                score >= clickPower * 10
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              ⚡ 클릭 파워 업그레이드 ({clickPower * 10}점)
            </button>
            <div className="text-white/60 text-xs mt-1">
              클릭당 점수 +1 (현재: {clickPower})
            </div>
          </div>

          {/* 자동 클릭 구매 */}
          <div>
            <button
              onClick={buyAutoClicker}
              disabled={score < (autoClickers + 1) * 50}
              className={`w-full p-3 rounded-lg font-semibold transition-all ${
                score >= (autoClickers + 1) * 50
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              🤖 자동 클릭 구매 ({(autoClickers + 1) * 50}점)
            </button>
            <div className="text-white/60 text-xs mt-1">
              초당 자동 점수 +1 (현재: {autoClickers}/초)
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📊 통계</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{clickPower}</div>
              <div className="text-white/60 text-sm">클릭 파워</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{autoClickers}</div>
              <div className="text-white/60 text-sm">자동 클릭</div>
            </div>
          </div>
        </div>

        {/* 리셋 버튼 */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            🔄 게임 리셋
          </button>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "🎯 클리커 게임",
  description: "클릭해서 점수를 올리고 업그레이드를 구매하는 간단한 클리커 게임",
  type: "react",
  tags: ["게임","클리커","React"],
  folder: "게임",
  createdAt: "2025-07-07T00:00:00.000Z",
  updatedAt: "2025-07-07T00:00:00.000Z",
} as const;

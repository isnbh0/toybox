import React, { useState, useEffect } from 'react';
import { Heart, Utensils, Zap, Coffee, Gamepad2, Bed } from 'lucide-react';

const CatCareGame = () => {
  const [catStats, setCatStats] = useState({
    hunger: 100,
    happiness: 100,
    energy: 100,
    level: 1,
    experience: 0
  });
  
  const [catMood, setCatMood] = useState('happy');
  const [message, setMessage] = useState('안녕하세요! 저는 당신의 고양이입니다 🐱');
  const [coins, setCoins] = useState(50);

  // 시간이 지나면서 스탯 감소
  useEffect(() => {
    const interval = setInterval(() => {
      setCatStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
        energy: Math.max(0, prev.energy - 0.3)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 고양이 기분 업데이트
  useEffect(() => {
    const avgStats = (catStats.hunger + catStats.happiness + catStats.energy) / 3;
    
    if (avgStats > 80) {
      setCatMood('happy');
      setMessage('냥냥~ 기분이 좋아요! 😸');
    } else if (avgStats > 50) {
      setCatMood('normal');
      setMessage('음... 괜찮아요 😺');
    } else if (avgStats > 20) {
      setCatMood('sad');
      setMessage('조금 우울해요... 😿');
    } else {
      setCatMood('angry');
      setMessage('화났어요! 저를 돌봐주세요! 😾');
    }
  }, [catStats]);

  // 레벨업 체크
  useEffect(() => {
    const expNeeded = catStats.level * 100;
    if (catStats.experience >= expNeeded) {
      setCatStats(prev => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - expNeeded
      }));
      setCoins(prev => prev + 20);
      setMessage(`레벨업! 이제 ${catStats.level + 1}레벨이에요! 🎉`);
    }
  }, [catStats.experience, catStats.level]);

  const feedCat = () => {
    if (coins >= 10) {
      setCatStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 30),
        happiness: Math.min(100, prev.happiness + 10),
        experience: prev.experience + 15
      }));
      setCoins(prev => prev - 10);
      setMessage('냠냠~ 맛있어요! 🍣');
    } else {
      setMessage('코인이 부족해요! 😿');
    }
  };

  const playCat = () => {
    if (coins >= 5 && catStats.energy > 20) {
      setCatStats(prev => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 25),
        energy: Math.max(0, prev.energy - 20),
        experience: prev.experience + 20
      }));
      setCoins(prev => prev - 5);
      setMessage('와~ 놀이 재미있어요! 🎾');
    } else if (catStats.energy <= 20) {
      setMessage('너무 피곤해요... 잠시 쉬어야겠어요 😴');
    } else {
      setMessage('코인이 부족해요! 😿');
    }
  };

  const petCat = () => {
    setCatStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      experience: prev.experience + 10
    }));
    setMessage('기분 좋아요~ 쓰다듬어주세요! 😽');
  };

  const letCatSleep = () => {
    setCatStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      experience: prev.experience + 10
    }));
    setMessage('쿨쿨... 잘 잤어요! 😴');
  };

  const earnCoins = () => {
    setCoins(prev => prev + 15);
    setMessage('일해서 코인을 벌었어요! 💰');
  };

  const getStatColor = (value) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCatEmoji = () => {
    switch(catMood) {
      case 'happy': return '😸';
      case 'normal': return '😺';
      case 'sad': return '😿';
      case 'angry': return '😾';
      default: return '😺';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">고양이 키우기 게임</h1>
          <div className="text-6xl mb-4">{getCatEmoji()}</div>
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <p className="text-gray-700">{message}</p>
          </div>
        </div>

        {/* 고양이 정보 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="font-bold text-lg">레벨 {catStats.level}</div>
              <div className="text-sm text-gray-600">경험치: {catStats.experience}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-yellow-600">💰 {coins}</div>
              <div className="text-sm text-gray-600">코인</div>
            </div>
          </div>
        </div>

        {/* 스탯 바 */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Utensils className="text-orange-500" size={20} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>배고픔</span>
                <span>{Math.round(catStats.hunger)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getStatColor(catStats.hunger)}`}
                  style={{ width: `${catStats.hunger}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Heart className="text-red-500" size={20} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>행복도</span>
                <span>{Math.round(catStats.happiness)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getStatColor(catStats.happiness)}`}
                  style={{ width: `${catStats.happiness}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="text-blue-500" size={20} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>에너지</span>
                <span>{Math.round(catStats.energy)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getStatColor(catStats.energy)}`}
                  style={{ width: `${catStats.energy}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={feedCat}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Utensils size={18} />
            먹이주기 (10코인)
          </button>
          
          <button
            onClick={playCat}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Gamepad2 size={18} />
            놀아주기 (5코인)
          </button>
          
          <button
            onClick={petCat}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Heart size={18} />
            쓰다듬기 (무료)
          </button>
          
          <button
            onClick={letCatSleep}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Bed size={18} />
            재우기 (무료)
          </button>
        </div>

        <button
          onClick={earnCoins}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Coffee size={18} />
          일하기 (+15코인)
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 팁: 스탯이 떨어지면 고양이가 불행해져요!</p>
          <p>정기적으로 돌봐주세요 🐱</p>
        </div>
      </div>
    </div>
  );
};

export default CatCareGame;

export const metadata = {
  title: "🐱 고양이 키우기 게임",
  description: "귀여운 고양이를 돌보며 배고픔, 행복도, 에너지를 관리하는 간단한 키우기 게임입니다. 시간이 지나면서 스탯이 감소하니 정기적으로 돌봐주세요!",
  type: "react",
  tags: ["게임","고양이","키우기","React","한국어"],
  folder: "게임",
  createdAt: "2025-07-07T00:00:00.000Z",
  updatedAt: "2025-07-07T00:00:00.000Z",
} as const;

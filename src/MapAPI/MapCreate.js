import React, { useState, useMemo } from "react";
import { MapMarker, useKakaoLoader, useMap } from "react-kakao-maps-sdk";

const SetBounds = () => {
  useKakaoLoader(); // Kakao 지도 API 로더

  const [points] = useState([
    { lat: 36.436988, lng: 126.802021 }, // 첫 번째 좌표
    { lat: 36.852671, lng: 127.774792 }, // 두 번째 좌표
    { lat: 36.651744, lng: 128.672441 }, // 세 번째 좌표
  ]);

  return (
    <>
      <h1>Kakao 지도 범위 설정 예제</h1>
      <div id="map" style={{ width: "800px", height: "700px" }}>
        {points.map((point) => (
          <MapMarker
            key={`marker__${point.lat}-${point.lng}`}
            position={point}
          />
        ))}
        <ReSetttingMapBounds points={points} />
      </div>
    </>
  );
};

const ReSetttingMapBounds = ({ points }) => {
  const map = useMap(); // 지도 객체 가져오기

  const bounds = useMemo(() => {
    const bounds = new window.kakao.maps.LatLngBounds();

    points.forEach((point) => {
      bounds.extend(new window.kakao.maps.LatLng(point.lat, point.lng));
    });
    return bounds;
  }, [points]);

  const handleSetBounds = () => {
    if (map) {
      map.setBounds(bounds); // 마커들이 모두 포함되도록 지도 범위 설정
    }
  };

  return (
    <p>
      <button onClick={handleSetBounds}>지도 범위 재설정 하기</button>
    </p>
  );
};

export default SetBounds;

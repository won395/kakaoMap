import React, { useEffect, useRef, useState } from 'react';

/* global kakao */

const KakaoMap = () => {

  const mapRef = useRef(null); // 지도 객체를 참조할 ref 생성
  const [MapTypeId, setMapTypeId] = useState(null); // 지도 타입 상태 관리
  const [info, setInfo] = useState(""); // 지도 정보를 저장할 상태
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
      return;
    }

    // Kakao 지도 API가 로드된 후에 실행
    if (window.kakao) {

      const container = document.getElementById('map'); // 지도 컨테이너 엘리먼트를 찾기
      
      // 지도 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(36.43698897735751, 126.80202130837696), // 충도대 위치 중심 좌표
        level: 5, // 확대 레벨
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map; // Store the map instance in the ref 추가

      console.log("Kakao Map Version:", window.kakao.maps.VERSION); //버전 체크(뺼 기능)

      const markerPosition = new window.kakao.maps.LatLng(36.436988, 126.802021);
      const markerPosition1 = new window.kakao.maps.LatLng(36.459105, 126.802004); // 마커 위치
      
      const marker = new window.kakao.maps.Marker({ position: markerPosition }); // 마커 생성
      const marker1 = new window.kakao.maps.Marker({ position: markerPosition1 }); // 마커1 생성

      // 지도에 마커 표시
      marker.setMap(map);
      marker1.setMap(map);

      // 인포윈도우 (마커 클릭 시 표시될 정보창)
      const infowindow = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:12px;">후라보노보노</div>' +
        '<a href="https://cnsu.ac.kr/main.do" style={{ color: "blue" }} target="_blank" rel="noreferrer">충남도립대학교</a>',
        removable: true,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
      });

      // 지도 클릭 이벤트 추가
      window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
        const latLng = mouseEvent.latLng; // 클릭한 위치의 좌표
        addMarker(latLng); // 클릭한 위치에 마커 추가
      });

      // 맵 유형 지정
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      // 줌 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    }
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !MapTypeId) return;

    try {
      map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
      map.removeOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE);
      map.removeOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRCT);

      //지도 타입 변경
      switch (MapTypeId) {
        case "TRAFFIC":
          map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC); //교통정보
          break;
        case "ROADVIEW":
          map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW) //로드뷰
          break;
        case "TERRAIN":
          map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN) //지형 정보
          break;
        case "BICYCLE":
          map.addOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE); // 자전거 정보
          break;
        case "USE_DISTRICT":
          map.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT); // 지적편집도 정보
          break;
        default:
          map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADMAP); // 기본 지도 정보
          break;
      }
    } catch (error) {
      console.error('지도 타입 변경 중 오류 발생: ', error);
    }
  }, [MapTypeId]);


  const addMarker = (position, isCustom = false) => {
    const map = mapRef.current;
    if (!map) return;

    const markerOptions = {
      position,
      draggable: true,
      removable: true,
    };

    if (isCustom) {
      markerOptions.image = new window.kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new kakao.maps.Size(24, 35)
      );
    }
  
    // 마커 생성
    const marker = new window.kakao.maps.Marker(markerOptions);
    marker.setMap(map);
  
    // 인포윈도우 생성
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">클릭한 위치: ${position.getLat()}, ${position.getLng()}</div>`,
      removable: true,
    });
  
    // 마커 클릭 이벤트 추가
    window.kakao.maps.event.addListener(marker, "click", () => {
      infowindow.open(map, marker);
    });
  
    // 상태에 마커와 인포윈도우 저장
    setMarkers((prevMarkers) => [...prevMarkers, { marker, infowindow }]);
  };
  
  const clearMarkers = () => {
    // 저장된 모든 마커와 인포윈도우 삭제
    markers.forEach(({ marker, infowindow }) => {
      if (marker) marker.setMap(null); // 지도에서 마커 제거
      if (infowindow) infowindow.close(); // 인포윈도우 닫기
    });

    setMarkers([]); // 마커 상태 초기화
  };

  const getInfo = () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();         // 지도의 가운데 지정
    const level = map.getLevel();           // 지도의 현재 레벨을 얻어옵니다
    const mapTypeId = map.getMapTypeId();   // 지도타입을 얻어옵니다
    const bounds = map.getBounds();         // 지도의 현재 영역을 얻어옵니다
    const swLatLng = bounds.getSouthWest(); // 영역의 남서쪽 좌표를 얻어옵니다
    const neLatLng = bounds.getNorthEast(); // 영역의 북동쪽 좌표를 얻어옵니다

    let message = "지도 중심좌표는 위도 " + center.getLat() + ", <br>"
    message += "경도 " + center.getLng() + " 이고 <br>"
    message += "지도 레벨은 " + level + " 입니다 <br> <br>"
    message += "지도 타입은 " + mapTypeId + " 이고 <br> "
    message += "지도의 남서쪽 좌표는 " + swLatLng.getLat() + ", " + swLatLng.getLng() + " 이고 <br>"
    message += "북동쪽 좌표는 " + neLatLng.getLat() + ", " + neLatLng.getLng() + " 입니다.";

    setInfo(message);
  };

  const resetMapBounds = () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(new kakao.maps.LatLng(36.43698897735751, 126.80202130837696)); // 충도대 좌표 추가
    bounds.extend(new kakao.maps.LatLng(36.459105780044275, 126.80200414891813)); // 추가 영역 좌표

    map.setBounds(bounds); // 지도의 영역을 설정
  };

  return (
    <div>
      <h1>Kakao 지도</h1>
      <div id="map" style={{ marginLeft: '200px', width: '800px', height: '700px', margin: "0 auto" }}></div>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <h1>타입 변경</h1>
      <button onClick={() => setMapTypeId("ROADMAP")} >기본지도 보기</button>{" "}
      <button onClick={() => setMapTypeId("TRAFFIC")} >교통 정보 보기</button>{" "}
      <button onClick={() => setMapTypeId("ROADVIEW")} >로드뷰 보기</button>{" "}
      <button onClick={() => setMapTypeId("TERRAIN")} >지형 정보 보기</button>{" "}
      <button onClick={() => setMapTypeId("BICYCLE")} >자전거 도로 정보 보기</button>{" "}
      <button onClick={() => setMapTypeId("USE_DISTRICT")} >지적 편집도 보기</button><br/>
      

      <h1>지도 범위</h1>
      <button id="resetBoundsBtn" onClick={resetMapBounds}>맵핑 범위 재설정</button>
      <button onClick={clearMarkers}>모든 마커 제거</button>

      <h1>커스텀 마커</h1>
      <button onClick={() => addMarker(new kakao.maps.LatLng(36.437, 126.803), true)}>커스텀 마커 추가</button>
      </div>


      <h1>맵 정보 가저오기</h1>
      <button id="getInfoBtn" onClick={getInfo}>맵정보 가져오기</button><br/>
      <p id="info"
        dangerouslySetInnerHTML={{
          __html: info,
        }} />
    </div>
    
  );
};

export default KakaoMap;
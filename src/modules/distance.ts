const R = Math.PI / 180;

/**
 * 2点間の緯度経度を引数にとり、2点間の距離をメートルで返す関数
 * @param lat1 地点1の緯度
 * @param lng1 地点1の経度
 * @param lat2 地点2の緯度
 * @param lng2 地点2の経度
 * @returns 地点1と地点2の距離(メートル)
 */
const distance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    lat1 *= R;
    lng1 *= R;
    lat2 *= R;
    lng2 *= R;
    return (
        6371 *
        Math.acos(
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
                Math.sin(lat1) * Math.sin(lat2)
        ) *
        1000
    );
};

export default distance;

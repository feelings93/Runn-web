export const mapTokenDataToSneaker = (tokenData) => {
  const { level, tokenId, info } = tokenData;
  const jsonInfo = JSON.parse(String(info).replaceAll(' ', ', '));
  const {
    rarity,
    type,
    performance,
    joy,
    durability,
    condition,
    mint,
    parents,
    imgUrl,
  } = jsonInfo;
  return {
    level,
    id: tokenId,
    rarity,
    type,
    performance,
    joy,
    durability,
    condition,
    mint,
    parents,
    imgUrl,
  };
};

export const mapTokenDataToSneakerInDetail = (tokenData) => {
  const { _level, _data } = tokenData;
  const jsonInfo = JSON.parse(String(_data).replaceAll(' ', ', '));
  const {
    rarity,
    type,
    performance,
    joy,
    durability,
    condition,
    mint,
    parents,
    imgUrl,
  } = jsonInfo;
  return {
    level: _level,
    rarity,
    type,
    performance,
    joy,
    durability,
    condition,
    mint,
    parents,
    imgUrl,
  };
};

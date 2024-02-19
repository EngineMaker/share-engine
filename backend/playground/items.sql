-- オーナーと借り主と貸出状況をつけたモノ一覧
select
  item.id,
  item.name,
  OWNER.name as owner,
  renter.name as renter,
  log.returned,
  log.returned_at
FROM items item
  LEFT OUTER JOIN users owner ON item.owner_id = owner.id
  LEFT OUTER JOIN rent_logs log ON item.id = log.item_id and log.returned = FALSE
  LEFT OUTER JOIN users renter ON log.renter_id = renter.id

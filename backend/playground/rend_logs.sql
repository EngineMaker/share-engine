-- 貸し借りの記録一覧
select
  log.id as log_id,
  item.name as item,
  owner.name as owner,
  renter.name as renter,
  returned,
  returned_at
from rent_logs log
  LEFT OUTER JOIN items item on item.id = log.item_id
  left OUTER JOIN users owner on owner_id = owner.id
  left outer join users renter on renter_id = renter.id
order by log.id DESC
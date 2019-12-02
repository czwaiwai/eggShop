'use strict';
module.exports = app => {
  // 库存表
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const InventorySchema = new Schema({
    product_id: {
      type: Schema.Types.ObjectId,
    },
    storeId: { // 商铺 id
      type: Schema.Types.ObjectId,
    },
    location: [], // 定位
    vars: [{
      sku_id: {
        type: Schema.Types.ObjectId,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    }],
  });
  return mongoose.model('Inventory', InventorySchema, 'inventory');
};

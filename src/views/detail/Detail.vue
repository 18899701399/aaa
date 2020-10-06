<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-botton-bar :addCart="addToCart"></detail-botton-bar>
<!--    <toast :message="message" :show="show"></toast>-->
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottonBar from "@/views/detail/childComps/DetailBottonBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
import {debounce} from "@/common/utils";
import {itemListenerMixin, backTopMixin} from "@/common/mixin";

import {mapActions} from 'vuex'

// import Toast from "@/components/common/toast/Toast";

export default {
  name: "Detail",
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopY: [0, 10, 100, 1000],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 获取顶部的图片轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages
      // 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 创建店铺信息对象
      this.shop = new Shop(data.shopInfo)
      // 保存商品的详情数据
      this.detailInfo = data.detailInfo
      // 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParam.info, data.itemParam.rule)
      // 取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // this.$nextTick(() => {
      //   // 值不对的原因：图片未加载完
      //   // 根据最新的数据，对呀的DOM是已经被渲染出来
      //   // 但是图片依然没有加载完成
      //   // offsetTop值不对的时候都是图片未加载完
      //   this.themeTopY = []
      //   this.themeTopY.push(0);
      //   this.themeTopY.push(this.$refs, params.$el.offsetTop)
      //   this.themeTopY.push(this.$refs, comment.$el.offsetTop)
      //   this.themeTopY.push(this.$refs, recommend.$el.offsetTop)
      // })

    })

    // 请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    this.getThemeTopY = debounce(() => {
      this.themeTopY = []
      this.themeTopY.push(0);
      this.themeTopY.push(this.$refs, params.$el.offsetTop)
      this.themeTopY.push(this.$refs, comment.$el.offsetTop)
      this.themeTopY.push(this.$refs, recommend.$el.offsetTop)
      this.themeTopY.push(Number.MAX_VALUE)
    }, 100)
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottonBar,
    Scroll,
    GoodsList,
    // Toast
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      this.$refs.scroll.refresh()

      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopY[index], 100)
    },
    contentScroll(position) {
      // 获取y值
      const positionY = -position.y

      // positionY和主题中的值对比
      let length = this.themeTopY.length
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopY[i] && positionY < this.themeTopY[i + 1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }

        // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopY[i] && positionY < this.themeTopY[i + 1]) || (i === length - 1 && positionY > this.themeTopY[i]))) {
        //   this.currentIndex = i
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }

        this.isShowBackTop = (-position.y) > 1000
      }
    },
    addToCart() {
      // 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 将商品加入购物车
      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;
        //
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // }, 1500)

        this.$toast.show(res, 2000)
      })
      // this.$store.commit('addCart', product)
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
    }
  },
  mounted() {

  },
  // updated() {
  //   this.themeTopY = []
  //
  //   this.themeTopY.push(0);
  //   this.themeTopY.push(this.$refs.params.$el.offsetTop)
  //   this.themeTopY.push(this.$refs.comment.$el.offsetTop)
  //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop)
  // },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },

}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>

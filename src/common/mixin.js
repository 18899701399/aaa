import BackTop from "@/components/content/backTop/BackTop";

import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  date() {
    return {
      itemImgListener: null
    }
  },
  mounte() {
    let refresh = debounce(this.$refs.scroll.refresh, 500)

    // 对监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  date() {
    return {
      isShowBackTop: true,
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0,300)
    }
  }
}

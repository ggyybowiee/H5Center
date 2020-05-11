<template>
  <div :class="['index-page', {'unitv-tab': tvType == 2}, {'brasiltv-tab': tvType == 1}]" :tabindex="1"
    hidefocus="true">
    <div class="invite-title">
      {{$t('隐私政策')}}
    </div>
    <div class="tab" v-if="tvType == 1">
      <p class="desp">{{$t('Esta Política')}}</p>
      <p class="head-title">{{$t('Tratamento dos Dados Pessoais')}}</p>
      <p class="content">{{$t('Tratamento1')}}</p>
      <p class="content">{{$t('Tratamento2')}}</p>
      <p class="content">{{$t('Tratamento3')}}</p>
      <p class="content">{{$t('Tratamento4')}}</p>
      <p class="content">{{$t('Tratamento5')}}</p>
      <p class="content">{{$t('Tratamento6')}}</p>

      <p class="head-title">{{$t('Atualização do Consentimento de Dados')}}</p>
      <p class="content">{{$t('Atualização1')}}</p>
      <p class="content">{{$t('Atualização2')}}</p>

      <p class="head-title">{{$t('Guarda de registros de conexão e de aplicação')}}</p>
      <p class="content">{{$t('Guarda1')}}</p>
      <p class="content">{{$t('Guarda2')}}</p>
      <p class="content">{{$t('Guarda3')}}</p>
      <p class="content">{{$t('Guarda4')}}</p>
      <p class="content">{{$t('Guarda5')}}</p>

      <p class="head-title">{{$t('Segurança no acesso e no armazenamento dos dados')}}</p>
      <p class="content">{{$t('Segurança1')}}</p>
      <p class="content">{{$t('Segurança2')}}</p>
      <p class="content">{{$t('Segurança3')}}</p>

      <p class="head-title">{{$t('Uso de cookies')}}</p>
      <p class="content">{{$t('Uso1')}}</p>
      <p class="content">{{$t('Uso2')}}</p>
      <p class="content">{{$t('Uso3')}}</p>
      <p class="content">{{$t('Uso4')}}</p>

      <p class="head-title">{{$t('Sites e Aplicativos de terceiros')}}</p>
      <p class="content">{{$t('Sites1')}}</p>

      <p class="head-title">{{$t('Outros')}}</p>
      <p class="content">{{$t('Outros1')}}</p>
      <p class="content">{{$t('Outros2')}}</p>
      <p class="content">{{$t('Outros3')}}</p>
      <p class="content">{{$t('Outros4')}}</p>

      <p class="head-title">{{$t('Vigência')}}</p>
      <p class="content">{{$t('Vigência1')}}</p>
      <p class="content">{{$t('Vigência2')}}</p><br>

    </div>

    <div class="tab" v-if="tvType == 2">
      <p class="desp">{{$t('Esta Política descreve')}}</p>
      <p class="head-title">{{$t('Tratamento dos Dados Pessoais')}}</p>
      <p class="content">{{$t('Tratamentodos1')}}</p>
      <p class="content">{{$t('Tratamentodos2')}}</p>
      <p class="content">{{$t('Tratamentodos3')}}</p>
      <p class="content">{{$t('Tratamentodos4')}}</p>
      <p class="content">{{$t('Tratamentodos5')}}</p>
      <p class="content">{{$t('Tratamentodos6')}}</p>

      <p class="head-title">{{$t('Atualização do Consentimento de Dados')}}</p>
      <p class="content">{{$t('Atualizaçãodo1')}}</p>
      <p class="content">{{$t('Atualizaçãodo2')}}</p>

      <p class="head-title">{{$t('Guarda de registros de conexão e de aplicação')}}</p>
      <p class="content">{{$t('Guardade1')}}</p>
      <p class="content">{{$t('Guardade2')}}</p>
      <p class="content">{{$t('Guardade3')}}</p>
      <p class="content">{{$t('Guardade4')}}</p>
      <p class="content">{{$t('Guardade5')}}</p>

      <p class="head-title">{{$t('Segurança no acesso e no armazenamento dos dados')}}</p>
      <p class="content">{{$t('Segurançano1')}}</p>
      <p class="content">{{$t('Segurançano2')}}</p>
      <p class="content">{{$t('Segurançano3')}}</p>

      <p class="head-title">{{$t('Uso de cookies')}}</p>
      <p class="content">{{$t('Usode1')}}</p>
      <p class="content">{{$t('Usode2')}}</p>
      <p class="content">{{$t('Usode3')}}</p>
      <p class="content">{{$t('Usode4')}}</p>

      <p class="head-title">{{$t('Sites e Aplicativos de terceiros')}}</p>
      <p class="content">{{$t('Sitese1')}}</p>

      <p class="head-title">{{$t('Outros')}}</p>
      <p class="content">{{$t('Outroses1')}}</p>
      <p class="content">{{$t('Outroses2')}}</p>
      <p class="content">{{$t('Outroses3')}}</p>
      <p class="content">{{$t('Outroses4')}}</p>

      <p class="head-title">{{$t('Vigência')}}</p>
      <p class="content">{{$t('Vigências1')}}</p>
      <p class="content">{{$t('Vigências2')}}</p><br>
    </div>
  </div>
</template>

<script>
  import api from "../../api/api";
  import util from "../../common";
  export default {
    data() {
      return {
        lang: sessionStorage.getItem("lang") ?
          sessionStorage.getItem("lang") : "",
        tvType: sessionStorage.getItem("tvType") ?
          sessionStorage.getItem("tvType") : 1
      };
    },
    mounted() {
      document.title = this.$t("详细规则");
      this.tvType = sessionStorage.getItem("tvType");
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      // 消息提示
      message(msg) {
        this.$message.closeAll();

        this.$message({
          duration: 4000,
          showClose: true,
          message: `${msg}`,
          type: "",
          iconClass: ""
        });
      }
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 0;
    font-size: 1.25rem;
    position: relative;
    max-height: 100vh;
    background: url('../../assets/images/brasiltv/bg.png') no-repeat;
    background-size: cover;
    color: #fff;
    overflow-y: auto;

    /*滚动条样式*/
    ::-webkit-scrollbar {
      width: 0.5rem;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ccc;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: transparent;
    }

    .invite-title {
      height: 4rem;
      line-height: 4.5rem;
      color: #bbc0c3;
      font-size: 2.4rem;
      border-bottom: 1px solid #b2b5b9;
      padding: 0.5rem 3rem 0rem;
    }

    .tab {
      border-radius: 0.5rem;
      text-align: center;
      padding: 0 3rem;

      .desp {
        color: #ffaa01;
        margin: 1.5rem 0rem;
        font-size: 1.5rem;
        margin-top: 1.5rem;
      }

      .head-title {
        color: #fff;
        margin: 1.5rem 0rem;
        font-size: 1.3rem;

        span {
          color: #3884fe;
        }
      }

      .content {
        color: #bbc0c3;
        margin: 1rem 0rem;

        span {
          color: #3884fe;
        }
      }

      img {
        width: 100%;
      }

      p {
        text-align: left;
      }
    }
  }

  .unitv-tab {
    background: url('../../assets/images/unitv/bg.png') no-repeat;
    background-size: cover;
  }

</style>

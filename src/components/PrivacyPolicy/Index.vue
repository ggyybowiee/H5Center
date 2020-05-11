<template>
  <div class="index-page">
    <p class="head-text">{{$t('隐私政策')}}</p>
    <div class="index-tab">
      <div class="tab">
        <p class="content" style="margin: 1rem 0;">{{$t('Esta Política')}}</p>

        <p class="head-title">{{$t('Tratamento dos Dados Pessoais')}}</p>
        <p class="content">{{$t('Tratamento1')}}</p><br>
        <p class="content">{{$t('Tratamento2')}}</p><br>
        <p class="content">{{$t('Tratamento3')}}</p><br>
        <p class="content">{{$t('Tratamento4')}}</p><br>
        <p class="content">{{$t('Tratamento5')}}</p><br>
        <p class="content">{{$t('Tratamento6')}}</p>

        <p class="head-title">{{$t('Atualização do Consentimento de Dados')}}</p>
        <p class="content">{{$t('Atualização1')}}</p><br>
        <p class="content">{{$t('Atualização2')}}</p>

        <p class="head-title">{{$t('Guarda de registros de conexão e de aplicação')}}</p>
        <p class="content">{{$t('Guarda1')}}</p><br>
        <p class="content">{{$t('Guarda2')}}</p><br>
        <p class="content">{{$t('Guarda3')}}</p><br>
        <p class="content">{{$t('Guarda4')}}</p><br>
        <p class="content">{{$t('Guarda5')}}</p>

        <p class="head-title">{{$t('Segurança no acesso e no armazenamento dos dados')}}</p>
        <p class="content">{{$t('Segurança1')}}</p><br>
        <p class="content">{{$t('Segurança2')}}</p><br>
        <p class="content">{{$t('Segurança3')}}</p>

        <p class="head-title">{{$t('Uso de cookies')}}</p>
        <p class="content">{{$t('Uso1')}}</p><br>
        <p class="content">{{$t('Uso2')}}</p><br>
        <p class="content">{{$t('Uso3')}}</p><br>
        <p class="content">{{$t('Uso4')}}</p>

        <p class="head-title">{{$t('Sites e Aplicativos de terceiros')}}</p>
        <p class="content">{{$t('Sites1')}}</p>

        <p class="head-title">{{$t('Outros')}}</p>
        <p class="content">{{$t('Outros1')}}</p><br>
        <p class="content">{{$t('Outros2')}}</p><br>
        <p class="content">{{$t('Outros3')}}</p><br>
        <p class="content">{{$t('Outros4')}}</p>

        <p class="head-title">{{$t('Vigência')}}</p>
        <p class="content">{{$t('Vigência1')}}</p><br>
        <p class="content">{{$t('Vigência2')}}</p><br>
      </div>
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
          sessionStorage.getItem("lang") : ""
      };
    },
    mounted() {
      document.title = this.$t("隐私政策");
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
    min-height: 100vh;
    background: #20202a;
    color: #fff;

    .head-text {
      text-align: center;
      background: #1a1a24;
      color: #fff;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem;
      font-size: 1.75rem;

      i {
        position: absolute;
        left: 0rem;
        color: #fff;
        width: 3rem;
        font-size: 1.75rem;
      }
    }

    .sub-title {
      font-size: 1.3rem;
      color: #fff;
      padding: 0rem 1rem;
      text-align: left;
    }

    .index-tab {
      display: flex;
      flex-direction: column;

      .tab {
        flex: 1;
        border-radius: 0.5rem;
        max-height: calc(100vh - 3.75rem);
        overflow-y: auto;
        padding: 0rem 1rem;
        text-align: center;

        .head-title {
          color: #ffaa01;
          margin: 1rem 0rem;
          font-size: 1.5rem;
        }

        .content {
          font-size: 1.3rem;
          color: #fff;
        }

        img {
          width: 100%;
        }

        p {
          text-align: left;
        }
      }
    }
  }

</style>

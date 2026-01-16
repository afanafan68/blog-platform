<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <p class="copyright">© 2024 Blog Platform. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">隐私政策</a>
          <a href="#">联系我们</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: $bg-secondary;
  border-top: 1px solid $border-color;
  padding: $spacing-xl 0;
  margin-top: $spacing-3xl;
}

.footer-container {
  max-width: $max-width;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    gap: $spacing-md;
    text-align: center;
  }
}

.copyright {
  color: $text-tertiary;
  font-size: $font-size-sm;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: $spacing-lg;

  a {
    color: $text-tertiary;
    font-size: $font-size-sm;

    &:hover {
      color: $text-primary;
    }
  }
}
</style>

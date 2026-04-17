<template>
  <div class="grid grid-cols-6 h-screen">
    <nav class="bg-dark">
      <NuxtLink to="/">
        <Logo class="mt-[28px] ml-6 mb-11" />
      </NuxtLink>

      <ul>
        <li
          v-for="page in pages"
          :key="page.route"
          class="text-grey-56 h-[50px]"
          :class="{ 'current-page': $route.path === page.route }"
        >
          <NuxtLink :to="page.route">
            <div class="flex items-center pl-6">
              <Icon
                :img="$route.path === page.route ? page.iconChecked : page.icon"
                class="mr-2"
              />
              {{ page.title }}
            </div>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="col-span-5 bg-deep-dark">
      <NotificationsBar />
      <slot />
    </div>
    <a href="https://discord.gg/Jbatd8BNxs" rel="noopener" target="_blank"  class="absolute bottom-[40px] right-[40px] flex bg-purple help-btn">
      ?
    </a>
  </div>
</template>

<script setup>
import Logo from '../components/logo'
import Icon from '../components/icon'

import Home from '/assets/icons/Home.svg'
import Profile from '/assets/icons/Profile.svg'
import Tasks from '/assets/icons/Tasks.svg'
import Friends from '/assets/icons/Friends.svg'

import HomeChecked from '/assets/icons/checked/Home.svg'
import ProfileChecked from '/assets/icons/checked/Profile.svg'
import NotificationsBar from '../components/NotificationsBar'

const pages = [
  { route: '/', icon: Home, iconChecked: HomeChecked, title: 'Главная' },
  {
    route: '/profile',
    icon: Profile,
    iconChecked: ProfileChecked,
    title: 'Профиль',
  },
  //  Когда появятся эти разделы, надо будет изменить роуты
  { route: '', icon: Tasks, title: 'Задания (скоро)' },
  { route: '', icon: Friends, title: 'Друзья (скоро)' },
]
</script>

<style scoped>
.current-page {
  color: white;
  background: url('/assets/Selector.svg') no-repeat;
}

.help-btn {
  width: 56px;
  height: 56px;
  justify-content: center;
  align-items: center;

  font-size: 22px;

  z-index: 1000;

  border-radius: 50%;
  transition: filter ease-in .1s;
}

.help-btn:hover {
  filter: drop-shadow(0px 4px 14px rgba(151, 71, 255, 0.5));
}

</style>

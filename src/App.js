import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from '@mantine/core';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';

import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

import './App.css'; // Replace with the actual path to your CSS file

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const taskTitle = useRef('');
  const taskSummary = useRef('');

  function createTask() {
    setTasks([
      ...tasks,
      {
        title: taskTitle.current.value,
        summary: taskSummary.current.value,
      },
    ]);

    saveTasks([
      ...tasks,
      {
        title: taskTitle.current.value,
        summary: taskSummary.current.value,
      },
    ]);
  }

  function deleteTask(index) {
    var clonedTasks = [...tasks];

    clonedTasks.splice(index, 1);

    setTasks(clonedTasks);

    saveTasks([...clonedTasks]);
  }

  function loadTasks() {
    let loadedTasks = localStorage.getItem('tasks');

    let tasks = JSON.parse(loadedTasks);

    if (tasks) {
      setTasks(tasks);
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: 'md' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className='App'>
          <Modal
            opened={opened}
            size={'md'}
            title={'New Task'}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput
              mt={'md'}
              ref={taskTitle}
              placeholder={'ToDo Task'}
              required
              label={'To Do'}
            />
            
            <Group mt={'md'} position={'apart'}>
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={'subtle'}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                  setOpened(false);
                }}
              >
                Create ToDOs
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={'apart'}>
              <Title
                className='custom-title' // Add a custom class to the Title component
              >
                My ToDOs
              </Title>
              <ActionIcon
                color={'blue'}
                onClick={() => toggleColorScheme()}
                size='lg'
              >
                {colorScheme === 'dark' ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (task.title) {
                  return (
                    <Card withBorder key={index} mt={'sm'}>
                      <Group position={'apart'}>
                        <Text weight={'bold'}>{task.title}</Text>
                        <ActionIcon
                          onClick={() => {
                            deleteTask(index);
                          }}
                          color={'red'}
                          variant={'transparent'}
                        >
                          <Trash />
                        </ActionIcon>
                      </Group>
                      <Text color={'dimmed'} size={'md'} mt={'sm'}>
                        {task.summary
                          ? task.summary
                          : 'No summary was provided for this task'}
                      </Text>
                    </Card>
                  );
                }
              })
            ) : (
              <Text size={'lg'} mt={'md'} color={'dimmed'}>
                You have no tasks to do....
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={'md'}
            >
              New ToDos
            </Button>
          </Container>
        </div>

      </MantineProvider>
    </ColorSchemeProvider>
  );
}

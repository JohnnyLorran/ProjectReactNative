import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOS/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Alert } from 'react-native';


type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Soliticição', 'Para encerrar, informa a solução.');
    }

    firestore().collection<OrderFirestoreDTO>('orders').doc(orderId).update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()

    })
      .then(() => {
        Alert.alert('Solicitação', 'Encerrada com sucesso.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Solicitação', 'Não foi possível encerrar.')
      });

  }

  useEffect(() => {
    firestore().collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        });
        setIsLoading(false);
      });

  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700" >
      <Box px={6}  bg="gray.600">
        <Header title='Detalhes da solicitação' />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }
        <Text color={order.status === 'closed'
          ? colors.green[300]
          : colors.secondary[700]}
          ml={2} textTransform="uppercase">

          {order.status === 'closed' ? 'Finalizado' : 'Em aberto'}

        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails tittle="Equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          footer={`Registado em ${order.when}`}
        />

        <CardDetails tittle="Descrição do problema"
          description={order.description}
          icon={ClipboardText}
        />

        <CardDetails tittle="Solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === 'open' &&
            <Input placeholder='Descrição da solução'
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24} />
          }
        </CardDetails>

      </ScrollView>
      {
        !order.closed && <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose} />
      }



    </VStack>
  );
}
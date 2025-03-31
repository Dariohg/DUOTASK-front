import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    AspectRatio,
    Button,
    VStack,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlay, FiExternalLink, FiYoutube } from 'react-icons/fi';
import { AnimatedBox } from './utils/AnimationUtils';

const VideoCard = ({ video, onClick }) => {
    return (
        <AnimatedBox
            animation="scale"
            delay={video.delay}
            borderRadius="xl"
            overflow="hidden"
            bg="background.secondary"
            boxShadow="md"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.03)"
            transition="all 0.3s ease"
            _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl",
            }}
        >
            <Box position="relative">
                <AspectRatio ratio={16 / 9}>
                    <Box
                        bgImage={`url(${video.thumbnail})`}
                        bgSize="cover"
                        bgPosition="center"
                    />
                </AspectRatio>
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="rgba(0, 0, 0, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    onClick={() => onClick(video)}
                    transition="all 0.3s ease"
                    _hover={{
                        bg: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <Box
                        width="60px"
                        height="60px"
                        borderRadius="full"
                        bg="brand.500"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="lg"
                    >
                        <Icon as={FiPlay} color="white" boxSize={6} />
                    </Box>
                </Box>
            </Box>
            <Box p={5}>
                <Heading size="md" mb={2}>{video.title}</Heading>
                <Text color="text.secondary" noOfLines={2} mb={4}>
                    {video.description}
                </Text>
                <Text fontSize="sm" color="brand.400" display="flex" alignItems="center">
                    <Icon as={FiYoutube} mr={1} /> {video.duration}
                </Text>
            </Box>
        </AnimatedBox>
    );
};

const VideoSection = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        onOpen();
    };

    const videos = [
        {
            id: 1,
            title: "Introducción a DUOTASK",
            description: "Conoce la plataforma que está revolucionando la gestión educativa. Una breve introducción a las principales características y beneficios.",
            thumbnail: "https://images.unsplash.com/photo-1573166953836-06864a79c208?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            videoId: "dQw4w9WgXcQ", // YouTube video ID
            duration: "3:45",
            delay: 0.1
        },
        {
            id: 2,
            title: "Tutorial: Gestión de Tareas",
            description: "Aprende cómo crear, asignar y evaluar tareas de manera eficiente. Maximiza tu productividad con DUOTASK.",
            thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            videoId: "dQw4w9WgXcQ", // YouTube video ID
            duration: "5:20",
            delay: 0.2
        },
        {
            id: 3,
            title: "Testimonios de Educadores",
            description: "Escucha las experiencias reales de profesores que han transformado su práctica docente con nuestra plataforma.",
            thumbnail: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            videoId: "dQw4w9WgXcQ", // YouTube video ID
            duration: "4:15",
            delay: 0.3
        },
    ];

    return (
        <Box py={20} bg="background.tertiary" position="relative" id="videos">
            <Container maxW="container.xl" position="relative" zIndex={1}>
                <AnimatedBox animation="slideUp" textAlign="center" mb={12}>
                    <Heading
                        size="xl"
                        mb={5}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Recursos en Video
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Explora nuestra colección de videos para conocer a fondo cómo DUOTASK puede transformar tu experiencia educativa
                    </Text>
                </AnimatedBox>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={12}>
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onClick={handleVideoClick}
                        />
                    ))}
                </SimpleGrid>

                <VStack>
                    <Button
                        rightIcon={<FiExternalLink />}
                        colorScheme="brand"
                        size="lg"
                        variant="outline"
                    >
                        Ver todos los videos
                    </Button>
                </VStack>
            </Container>

            {/* Modal para reproducir videos */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
                <ModalOverlay backdropFilter="blur(10px)" />
                <ModalContent bg="background.secondary">
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        {selectedVideo && (
                            <AspectRatio ratio={16 / 9}>
                                <iframe
                                    title={selectedVideo.title}
                                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                                    allowFullScreen
                                    allow="autoplay"
                                    style={{ borderRadius: '0.5rem' }}
                                />
                            </AspectRatio>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default VideoSection;
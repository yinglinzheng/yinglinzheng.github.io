---
pageClass: home-page
# some data for the components

name: Yinglin Zheng（郑英林）
profile: /profile.jpg

socials:
  - title: github
    icon: "/icons/github.svg"
    link: https://github.com/yinglinzheng
  - title: linkedin
    icon: "/icons/linkedin-mono.svg"
    link: https://www.linkedin.com/in/%E8%8B%B1%E6%9E%97-%E9%83%91-b17715135/

# researchgate: https://en.wikipedia.org/wiki/Harry_Potter
bio: Student at Xiamen University
email: zhengyinglin@stu.xmu.edu.cn
---

<ProfileSection :frontmatter="$page.frontmatter" />

## About Me

I'm currently a PhD student in the [Visual Computing and Graphics Lab](https://vcg.xmu.edu.cn/) of Xiamen University, supervised by professor [Ming Zeng](http://mingzeng.xyz/). 

I had a fantastic experience as a research intern at Visual Computing Group, [Microsoft Research Asia(MSRA)](https://www.msra.cn/), working with [Dr. Jianmin Bao](https://jianminbao.github.io/), [Dr. Ting Zhang](https://www.microsoft.com/en-us/research/people/tinzhan/), and [Dr. Dong Chen](http://www.dongchen.pro/).

My research interests lie at human-centric computer vision. I serve as the reviewer of CVPR, ICCV, ECCV, AAAI.

## News
- [Feb. 2023] Our work MaskCLIP is accepted by CVPR 2023.
- [Dec. 2022] Our work on singing head generation has been accepted by CVM2023 and will be published on CVMJ.
- [Nov. 2022] Our work on multi-exposure image fusion named EMEF has been accepted by AAAI2023.
- [Oct. 2022] I and my roommate [Wenjin Deng](https://wenjindeng.netlify.app/) won the National Scholarship for Postgraduate Students at the same time.
- [Sep. 2022] My tutorial about [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) is available on [Bilibili](https://www.bilibili.com/video/BV1rW4y1Y7M5/).
- [Jun. 2022] The [LAION-Face](https://github.com/FacePerceiver/LAION-Face) dataset was released to support large-scale face pretraining.
- [Jun. 2022] I received the reward of Excellent from the Star of Tomorrow Internship program in Microsoft Research Asia.
- [Apr. 2022] Our work on multi-person pose estimation named **I^2R-Net** is accepted by IJCAI 2022.
- [Mar. 2022] [FaRL](https://github.com/FacePerceiver/FaRL) is accepted by CVPR 2022 as oral presentation.
- [Dec. 2021] Our work on general facial representation learning named **FaRL** is released, code available on [Github](https://github.com/FacePerceiver/FaRL).
- [Jul. 2021] Our work on Deepfake Detection accepted by ICCV 2021.


## Publications

<ProjectCard hideBorder=true image="https://s1.ax1x.com/2022/08/29/vfir5D.png">

  MaskCLIP: Masked Self-Distillation Advances Contrastive Language-Image Pretraining

  Xiaoyi Dong, Jianmin Bao, **Yinglin Zheng**, Ting Zhang, Dongdong Chen, Hao Yang, Ming Zeng, Weiming Zhang, Lu Yuan, Dong Chen, Fang Wen, Nenghai Yu

  2023, IEEE Conference on Computer Vision and Pattern Recognition(CVPR)

  [Paper](https://arxiv.org/abs/2208.12262)

</ProjectCard> 

<ProjectCard hideBorder=true image="/projects/musicface.png">
  
  MusicFace: Music-driven Expressive Singing Face Synthesis

  Pengfei Liu, Wenjin Deng, Hengda Li, Jintai Wang, **Yinglin Zheng**, Yiwei Ding, Xiaohu Guo, Ming Zeng*

  2023, Computational Visual Media(CVMJ 2023)

  [Dataset](https://vcg.xmu.edu.cn/datasets/singingface/index.html)

</ProjectCard> 


<ProjectCard hideBorder=true image="/projects/emef.png">

  EMEF: Ensemble Multi-Exposure Image Fusion

  Renshuai Liu, Chengyang Li, Haitao Cao, **Yinglin Zheng**, Ming Zeng, Xuan Cheng*
    
  2023, AAAI Conference on Artificial Intelligence (AAAI), Oral presentation.

  [Project](https://github.com/medalwill/EMEF)

</ProjectCard>



<ProjectCard hideBorder=true image="https://s1.ax1x.com/2022/04/21/LyGJKK.png">

  I^2R-Net: Intra- and Inter-Human Relation Network for Multi-Person Pose Estimation

  Yiwei Ding, Wenjin Deng, **Yinglin Zheng**, Pengfei Liu, Jianmin Bao, Meihong Wang, Xuan Cheng, Ming Zeng, Dong Chen

  2022, The 31st International Joint Conference on Artificial Intelligence (IJCAI-22)

  [Paper](https://arxiv.org/abs/2206.10892) [Code](https://github.com/leijue222/Intra-and-Inter-Human-Relation-Network-for-MPEE)

</ProjectCard> 


<ProjectCard hideBorder=true image="https://s4.ax1x.com/2021/12/08/oRXqhj.png">

  General Facial Representation Learning in a Visual-Linguistic Manner

  **Yinglin Zheng**, Hao Yang, Ting Zhang, Jianmin Bao, Dongdong Chen, Yangyu Huang, Lu Yuan, Dong Chen, Ming Zeng, Fang Wen

  2022, IEEE Conference on Computer Vision and Pattern Recognition(CVPR), Oral presentation.

  [Paper](https://arxiv.org/abs/2112.03109) [Code](https://github.com/FacePerceiver/FaRL) [Dataset](https://github.com/FacePerceiver/LAION-Face)

  

</ProjectCard> 

<ProjectCard hideBorder=true image="/projects/ftcn.png">

  Exploring Temporal Coherence for More General Video Face Forgery Detection

  **Yinglin Zheng**, Jianmin Bao, Dong Chen, Ming Zeng, Fang Wen

  2021, International Conference on Computer Vision(ICCV)

  [Paper](https://arxiv.org/abs/2108.06693) [Code](https://github.com/yinglinzheng/FTCN)

  

</ProjectCard> 

<ProjectCard hideBorder=true image="/projects/mask_face.png">

  Real-time Masked Face Revealing for Video Conference

  Jinpeng Lin, Pengfei Liu, **Yinglin Zheng**, Wenjin Deng, Ming Zeng

  2021, IEEE International Conference on Multimedia and Expo (ICME), Oral presentation.

  <!-- [[Link](https://www.google.com)] -->

</ProjectCard>

<ProjectCard hideBorder=true image="/projects/uv_iccv.png">

  UV空间中的人脸颜色纹理和几何细节协同补全

  程轩，刘仁帅，**郑英林**，曾鸣

  2020, Chinagraph

  <!-- [[Link](https://www.google.com)] -->

</ProjectCard>


<ProjectCard hideBorder=true image="/projects/vh3d.png">

  VH3D-LSFM:Video-based Human 3D Pose Estimation with Long-term and Short-term Pose Fusion Mechanism

  Wenjin Deng, **Yinglin Zheng**, Hui Li, Xianwei Wang, Zizhao Wu, Ming Zeng

  2020, Chinese Conference on Pattern Recognition and Computer Vision(PRCV)

  [Link](https://www.researchgate.net/publication/346167722_VH3D-LSFM_Video-Based_Human_3D_Pose_Estimation_with_Long-Term_and_Short-Term_Pose_Fusion_Mechanism)

</ProjectCard>

<ProjectCard hideBorder=true image="/projects/denoise.png">

  Spatially Adaptive Regularizer for Mesh Denoising

  Xuan Cheng, **Yinglin Zheng**, Yuhui Zheng, Fang Chen, Kunhui Lin

  2020, IEEE Access

  [Link](https://www.researchgate.net/publication/340572393_Spatially_Adaptive_Regularizer_for_Mesh_Denoising)

</ProjectCard>

<ProjectCard hideBorder=true image="/projects/joint.png">

  Joint Depth-Face Translation and Facial Alignment via Multi-task Learning

  2019, Multimedia Tools and Applications

  Xiaoli Wang, **Yinglin Zheng**, Ming Zeng, Xuan Cheng, Wei Lu.

  [Link](https://www.researchgate.net/publication/341411157_Joint_learning_for_face_alignment_and_face_transfer_with_depth_image)

</ProjectCard>


## Awards & Honors

- National Scholarship for Graduate Students, 2022
- Stars of Tomorrow (Award of Excellent Intern), Microsoft Research Asia, 2022
- **Rank 10** among 2265 teams in **Kaggle Deepfake Detection Challenge**.
- **Champion** of 3D Face Alignment in the Wild Challenge (In conjunction with ICCV 2019), Seoul, Korea, 2019.


## Education & Experiences

- **Research Intern, Visual Computing Group, Microsoft Research Asia** <br/>
Dec. 2022 - Mar. 2024

- **Research Intern, Visual Computing Group, Microsoft Research Asia** <br/>
Sep. 2020 - Mar. 2022

- **Doctoral Student of Computer Science, School of Informatics, Xiamen University** <br/>
Sep. 2020 - present

- **Bachelor of Software Engineering, School of Informatics, Xiamen University** <br/>
Sep. 2016 - Jun. 2020

<!-- Custom style for this page -->

<style lang="stylus">

.theme-container.home-page .page
  font-size 14px
  font-family "lucida grande", "lucida sans unicode", lucida, "Helvetica Neue", Helvetica, Arial, sans-serif;
  p
    margin 0 0 0.5rem
  p, ul, ol
    line-height normal
  a
    font-weight normal
  .theme-default-content:not(.custom) > h2
    margin-bottom 0.5rem
  .theme-default-content:not(.custom) > h2:first-child + p
    margin-top 0.5rem
  .theme-default-content:not(.custom) > h3
    padding-top 4rem

  /* Override */
  .md-card
    margin-top 0.5em
    .card-image
      padding 0.2rem
      img
        max-width 120px
        max-height 120px
    .card-content p
      -webkit-margin-after 0.2em

@media (max-width: 419px)
  .theme-container.home-page .page
    p, ul, ol
      line-height 1.5

    .md-card
      .card-image
        img 
          width 100%
          max-width 400px

</style>

import { Flex } from "@chakra-ui/react";
import DefaultPageLayout, {
  ProjectMenuItems,
  ProjectToolbarItems,
} from "../components/DefaultPageLayout";
import FeaturesTable from "../components/FeaturesTable";

const FeaturesPage = () => {
  return (
    <>
      <DefaultPageLayout
      // localise this
        titleId="features"
        showPageTitle
        menuItems={<ProjectMenuItems />}
        toolbarItemsRight={<ProjectToolbarItems />}
      >
        <Flex as="main" flexGrow={1} flexDir="column">
          <FeaturesTable />
        </Flex>
      </DefaultPageLayout>
    </>
  );
};

export default FeaturesPage;
